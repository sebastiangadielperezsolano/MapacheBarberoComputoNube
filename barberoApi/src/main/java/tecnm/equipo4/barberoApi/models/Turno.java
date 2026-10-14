package tecnm.equipo4.barberoApi.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.text.DateFormat;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data

@Table(name = "turno")
public class Turno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idTurno")
    private Long idTurno;

    @NotNull
    @Column(name = "fecha")
    @FutureOrPresent
    private DateFormat fecha;

    @NotNull
    @Column(name = "horaInicio")
    @FutureOrPresent
    private DateFormat horaInicio;

    @NotNull
    @NotEmpty
    @Column(name = "estado")
    private String estado;

    @NotNull
    @NotEmpty
    @Column(name = "notasCliente")
    private String notasCliente;

    @NotNull
    @NotEmpty
    @Column(name = "sucursal")
    private String sucursal;

    @OneToOne(mappedBy = "turno", cascade = CascadeType.ALL)
    private Pago pago;
}
